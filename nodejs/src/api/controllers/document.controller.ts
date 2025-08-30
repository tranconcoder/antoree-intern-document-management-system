import type { UploadDocumentBody } from "@/validator/zod/document.zod";
import type { RequestHandler } from "express";

import { successResponses } from "@/constants/success.constant";
import SuccessResponse from "@/core/success";
import documentService from "@/services/document.service";

export default new (class DocumentController {
  uploadDocuments: RequestHandler = async (req, res) => {
    const body = req.body as UploadDocumentBody;
    const files = req.files as Express.Multer.File[];

    new SuccessResponse({
      successResponseItem: successResponses.DOCUMENT_UPLOAD_SUCCESS,
      metadata: await documentService.uploadDocuments(body, files, req.userId),
    }).sendResponse(res);
  };

  getSelfDocuments: RequestHandler = async (req, res) => {
    new SuccessResponse({
      successResponseItem: successResponses.DOCUMENT_FETCH_SUCCESS,
      metadata: await documentService.getSelfDocuments(req.userId),
    }).sendResponse(res);
  };

  getPublicDocuments: RequestHandler = async (req, res) => {
    new SuccessResponse({
      successResponseItem: successResponses.DOCUMENT_FETCH_SUCCESS,
      metadata: await documentService.getPublicDocuments(),
    }).sendResponse(res);
  };

  getDocumentById: RequestHandler = async (req, res) => {
    const { id } = req.params;

    new SuccessResponse({
      successResponseItem: successResponses.DOCUMENT_FETCH_SUCCESS,
      metadata: await documentService.getDocumentById(id as string),
    }).sendResponse(res);
  };

  getDocumentFileData: RequestHandler = async (req, res) => {
    const { id } = req.params;

    new SuccessResponse({
      successResponseItem: successResponses.DOCUMENT_FETCH_SUCCESS,
      metadata: await documentService.getDocumentFileData(id as string),
    }).sendResponse(res);
  };

  deleteSelfDocument: RequestHandler = async (req, res) => {
    const { id } = req.params;

    new SuccessResponse({
      successResponseItem: successResponses.DOCUMENT_DELETE_SUCCESS,
      metadata: await documentService.deleteSelfDocument(
        id as string,
        req.userId
      ),
    }).sendResponse(res);
  };
})();
