import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

// Load gRPC
const packageDefinition = protoLoader.loadSync("user.proto", {});
const userProto = grpc.loadPackageDefinition(packageDefinition).user as any;

// Create gRPC Client
const client = new userProto.UserService("localhost:5000", grpc.credentials.createInsecure());

// Updated Functions - Now using Promises

export function createUser(name: string, email: string): Promise<{ id: string; name: string; email: string }> {
  return new Promise((resolve, reject) => {
    client.CreateUser({ name, email }, (err: grpc.ServiceError | null, response: any) => {
      if (err) reject(err);
      else resolve(response);
    });
  });
}

export function getUser(id: string): Promise<{ id: string; name: string; email: string }> {
  return new Promise((resolve, reject) => {
    client.GetUser({ id }, (err: grpc.ServiceError | null, response: any) => {
      if (err) reject(err);
      else resolve(response);
    });
  });
}

export function deleteUser(id: string): Promise<{ message: string }> {
  return new Promise((resolve, reject) => {
    client.DeleteUser({ id }, (err: grpc.ServiceError | null, response: any) => {
      if (err) reject(err);
      else resolve(response);
    });
  });
}
