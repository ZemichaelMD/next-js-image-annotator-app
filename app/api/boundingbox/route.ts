import type { NextApiRequest, NextApiResponse } from 'next';

type Point = { x: number; y: number };

interface BoundingBox {
    leftTop: Point;
    rightBottom: Point;
}

export const dynamic = 'force-static'

export async function GET() {
    const boundingBoxes: BoundingBox[] = [
        { leftTop: { x: 0.1, y: 0.2 }, rightBottom: { x: 0.4, y: 0.5 } },
        { leftTop: { x: 0.6, y: 0.3 }, rightBottom: { x: 0.8, y: 0.6 } }
    ];

    return Response.json({ ...boundingBoxes })
}