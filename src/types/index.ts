export interface Post { id: number; userId: number; title: string; body: string; }
export interface User { id: number; name: string; username: string; email: string; phone: string; website: string; address: { street: string; suite: string; city: string; zipcode: string; geo: { lat: string; lng: string }; }; company: { name: string; }; }
export interface Todo { id: number; userId: number; title: string; completed: boolean; }
export interface LoginCredentials { username: string; password: string; }
