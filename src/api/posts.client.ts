// src/api/posts.client.ts — Posts endpoint client

import { APIRequestContext, APIResponse } from "@playwright/test";
import { APIClient } from "./base.client";
import type { Post } from "../types";

export class PostsClient extends APIClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async getAll(): Promise<APIResponse> {
    return this.get("/posts");
  }

  async getById(id: number): Promise<APIResponse> {
    return this.get(`/posts/${id}`);
  }

  async getByUser(userId: number): Promise<APIResponse> {
    return this.get("/posts", { userId: String(userId) });
  }

  async getComments(postId: number): Promise<APIResponse> {
    return this.get(`/posts/${postId}/comments`);
  }

  async create(payload: Omit<Post, "id">): Promise<APIResponse> {
    return this.post("/posts", payload);
  }

  async update(id: number, payload: Post): Promise<APIResponse> {
    return this.put(`/posts/${id}`, payload);
  }

  async updatePartial(id: number, payload: Partial<Post>): Promise<APIResponse> {
    return this.patch(`/posts/${id}`, payload);
  }

  async remove(id: number): Promise<APIResponse> {
    return this.delete(`/posts/${id}`);
  }
}
