const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
require('dotenv').config();

// Load gRPC Protobuf
const packageDefinition = protoLoader.loadSync('user.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb+srv://admin:admin@db-learning.jhypi.mongodb.net/?retryWrites=true&w=majority&appName=DB-Learning";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({ name: String, email: String });
const User = mongoose.model('User', UserSchema);

// gRPC Service Implementation
const server = new grpc.Server();

server.addService(userProto.UserService.service, {
  CreateUser: async (call, callback) => {
    try {
      const { name, email } = call.request;
      const user = new User({ name, email });
      await user.save();
      callback(null, { id: user._id.toString(), name, email });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: "Failed to create user",
      });
    }
  },

  GetUser: async (call, callback) => {
    try {
      const user = await User.findById(call.request.id);
      if (!user) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: "User not found",
        });
      }
      callback(null, { id: user._id.toString(), name: user.name, email: user.email });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: "Failed to fetch user",
      });
    }
  },

  DeleteUser: async (call, callback) => {
    try {
      const user = await User.findByIdAndDelete(call.request.id);
      if (!user) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: "User not found",
        });
      }
      callback(null, { message: "User deleted successfully" });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: "Failed to delete user",
      });
    }
  },
});

// Enable gRPC-Web Support
const grpcWebServer = new grpc.Server();
grpcWebServer.addService(userProto.UserService.service, server);

server.bindAsync('0.0.0.0:5000', grpc.ServerCredentials.createInsecure(), () => {
  console.log("🚀 gRPC Server running on port 5000");
});
