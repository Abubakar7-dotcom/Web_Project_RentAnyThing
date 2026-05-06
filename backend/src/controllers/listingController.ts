import { Request, Response } from 'express';
import * as listingService from '../services/listingService';

/**
 * Get all listings with optional filters
 */
export async function getListings(req: Request, res: Response) {
  try {
    const { search, category, page, limit } = req.query;
    
    const params = {
      search: search as string,
      category: category as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    };

    const result = await listingService.getListings(params);
    res.json(result);
  } catch (error) {
    console.error('Error getting listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get a single listing by ID
 */
export async function getListing(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid listing ID' });
    }
    
    const listing = await listingService.getListing(id);
    res.json(listing);
  } catch (error: any) {
    if (error.message === 'Listing not found') {
      res.status(404).json({ error: 'Listing not found' });
    } else {
      console.error('Error getting listing:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

/**
 * Create a new listing
 */
export async function createListing(req: Request, res: Response) {
  try {
    const ownerId = req.user!.id;
    const listing = await listingService.createListing(ownerId, req.body);
    res.status(201).json(listing);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Update an existing listing
 */
export async function updateListing(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid listing ID' });
    }
    
    const ownerId = req.user!.id;
    
    const listing = await listingService.updateListing(id, ownerId, req.body);
    res.json(listing);
  } catch (error: any) {
    if (error.message === 'Listing not found') {
      res.status(404).json({ error: 'Listing not found' });
    } else if (error.statusCode === 403) {
      res.status(403).json({ error: error.message });
    } else {
      console.error('Error updating listing:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

/**
 * Delete a listing
 */
export async function deleteListing(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid listing ID' });
    }
    
    const ownerId = req.user!.id;
    
    const result = await listingService.deleteListing(id, ownerId);
    res.json(result);
  } catch (error: any) {
    if (error.message === 'Listing not found') {
      res.status(404).json({ error: 'Listing not found' });
    } else if (error.statusCode === 403) {
      res.status(403).json({ error: error.message });
    } else {
      console.error('Error deleting listing:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}