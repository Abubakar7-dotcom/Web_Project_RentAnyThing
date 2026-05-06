import { Request, Response } from 'express';
import * as complaintService from '../services/complaintService';

/**
 * Submit a complaint
 */
export async function submitComplaint(req: Request, res: Response): Promise<void> {
  try {
    const { description, reportedUserId, listingId } = req.body;
    const reporterId = req.user!.id;

    const complaint = await complaintService.submitComplaint(reporterId, {
      description,
      reportedUserId,
      listingId,
    });

    res.status(201).json(complaint);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Get complaints submitted by the authenticated user
 */
export async function getComplaints(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;

    const complaints = await complaintService.getComplaints(userId);

    res.status(200).json(complaints);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || 'Internal server error' });
  }
}
