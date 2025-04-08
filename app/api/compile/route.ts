import { dockerCompiler } from '@/lib/docker-compiler';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { code, input, language = 'cpp' } = await req.json();

    // Create a virtual container
    const containerId = await dockerCompiler.createContainer(language);

    // Execute code in the "container"
    const result = await dockerCompiler.executeCode(containerId, code, input);

    // Cleanup
    await dockerCompiler.removeContainer(containerId);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Container execution failed' },
      { status: 500 }
    );
  }
}
