import {
  JOB_PENDING_FLAG,
  JOB_COMPLETED_FLAG,
  DEFAULT_MAX_REQUEST_RETRIES,
} from "@/constants/api";
import { LanguageRuntime } from "@/types/language";
import { NextResponse } from "next/server";

const CODE_PROCESSING_BASE_URL = process.env.CODE_PROCESSING_BASE_URL;
const SUBMIT_CODE_ENDPOINT = process.env.SUBMIT_CODE_ENDPOINT;
const GET_RESULT_ENDPOINT = process.env.GET_RESULT_ENDPOINT;

async function submitCode(sourceCode: string, runtimeConfig: LanguageRuntime) {
  const response = await fetch(
    `${CODE_PROCESSING_BASE_URL}${SUBMIT_CODE_ENDPOINT}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        code: sourceCode,
        runtimeConfig: runtimeConfig,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to send request to code execution queue. Status: ${response.status}.`
    );
  }

  return await response.json();
}

async function getResult(submissionId: string) {
  const response = await fetch(
    `${CODE_PROCESSING_BASE_URL}${GET_RESULT_ENDPOINT}/${submissionId}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to retrieve result from code execution queue. Status: ${response.status}.`
    );
  }

  return await response.json();
}

export async function POST(request: Request) {
  try {
    const { code, runtimeConfig } = await request.json();

    // Submit code for execution
    const response = await submitCode(code, runtimeConfig);

    if (!response.jobId) {
      return NextResponse.json(
        { error: `Response has missing field. Please try again.` },
        { status: 500 }
      );
    }

    const submissionId = response.jobId;

    // Wait for result
    let result;
    for (let i = 0; i < DEFAULT_MAX_REQUEST_RETRIES; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      result = await getResult(submissionId);
      if (result.status !== JOB_PENDING_FLAG) {
        break;
      }
    }

    if (result.status === JOB_COMPLETED_FLAG) {
      // Completed
      return NextResponse.json(
        {
          output: result.output || "Code executed successfully with no output.",
          error: result.error,
          exitCode: result.exitCode,
        },
        { status: 200 }
      );
    } else {
      // Failed
      return NextResponse.json(
        {
          error: result.error,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
