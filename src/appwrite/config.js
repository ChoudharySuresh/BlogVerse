import conf from "../conf/conf.js";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteURL)
      .setProject(conf.appwriteProjectID);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, featuredImage, content, status, userId }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseID,
        conf.appwriteCollectionID,
        slug,
        {
          title,
          featuredImage,
          content,
          status,
          userId,
        }
      );
    } catch (error) {
      console.log("AppWrite Service :: createpost :: error :: ", error);
    }
  }

  async updatePost(slug, { title, featuredImage, content, status }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseID,
        conf.appwriteCollectionID,
        slug,
        {
          title,
          featuredImage,
          content,
          status,
        }
      );
    } catch (error) {
      console.log("AppWrite Service :: updatePost :: error :: ", error);
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseID,
        conf.appwriteCollectionID,
        slug
      );
      return true;
    } catch (error) {
      console.log("AppWrite Service :: deletePost :: error :: ", error);
      return false;
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseID,
        conf.appwriteCollectionID,
        slug
      );
    } catch (error) {
      console.log("AppWrite Service :: getPost :: error :: ", error);
      return false;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseID,
        conf.appwriteDatabaseID,
        queries
      );
    } catch (error) {
      console.log("AppWrite Service :: getPosts :: error :: ", error);
      return false;
    }
  }

  // File Upload Service
  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketID,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("Appwrite serive :: uploadFile :: error", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketID, fileId);
      return true;
    } catch (error) {
      console.log("Appwrite serive :: deleteFile :: error", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    return this.bucket.getFilePreview(conf.appwriteBucketID, fileId);
  }
}

const service = new Service();
export default service;
