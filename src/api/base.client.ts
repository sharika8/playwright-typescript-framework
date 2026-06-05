// src/api/base.client.ts — Base API client

import { APIRequestContext, APIResponse, expect } from "@playwright/test";

export class APIClient {
  constructor(protected readonly request: APIRequestContext) {}

  async get(endpoint: string, params?: Record<string, string>): Promise<APIResponse> {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params).toString()}`
      : endpoint;
    return this.request.get(url);
  }

  async post(endpoint: string, body: unknown): Promise<APIResponse> {
    return this.request.post(endpoint, { data: body });
  }

  async put(endpoint: string, body: unknown): Promise<APIResponse> {
    return this.request.put(endpoint, { data: body });
  }

  async patch(endpoint: string, body: unknown): Promise<APIResponse> {
    return this.request.patch(endpoint, { data: body });
  }

  async delete(endpoint: string): Promise<APIResponse> {
    return this.request.delete(endpoint);
  }

  async assertStatus(response: APIResponse, expected: number): Promise<void> {
    expect(
      response.status(),
      `Expected HTTP ${expected} but got ${response.status()} for ${response.url()}`
    ).toBe(expected);
  }

  async assertOk(response: APIResponse): Promise<void> {
    expect(response.ok(), `Expected OK response for ${response.url()}`).toBeTruthy();
  }

  async json<T>(response: APIResponse): Promise<T> {
    return response.json() as Promise<T>;
  }
}
