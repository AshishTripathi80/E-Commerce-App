import { Router } from "express";
import categoryController from "../controller/category.controller";

const router = Router();

/**
 * @swagger
 * /api/admin/category:
 *   post:
 *     summary: Create a new category
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 example: Category for electronic items
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 12345
 *                 name:
 *                   type: string
 *                   example: Electronics
 *                 description:
 *                   type: string
 *                   example: Category for electronic items
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post('/category', categoryController.createCategory);

/**
 * @swagger
 * /api/admin/categories:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 12345
 *                   name:
 *                     type: string
 *                     example: Electronics
 *                   description:
 *                     type: string
 *                     example: Category for electronic items
 *       500:
 *         description: Internal Server Error
 */
router.get('/categories', categoryController.getAllCategory);

export default router;