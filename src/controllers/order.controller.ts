import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { CartService } from "../services/cart.service";

const orderService = new OrderService();
const cartService = new CartService();

export class OrderController {
    async createOrder(req: Request, res: Response) {
        try {
            const userId = req.user?._id?.toString();
            const { items, totalAmount } = req.body;

            if (!items || !totalAmount) {
                return res.status(400).json({
                    success: false,
                    message: "Items and totalAmount are required"
                });
            }

            const order = await orderService.createOrder(userId!, items, totalAmount);
            await cartService.clearCart(userId!);

            return res.status(201).json({
                success: true,
                data: order,
                message: "Order placed successfully"
            });
        } catch (error: any) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async getOrders(req: Request, res: Response) {
        try {
            const userId = req.user?._id?.toString();
            const orders = await orderService.getOrdersByUser(userId!);

            return res.status(200).json({
                success: true,
                data: orders,
                message: "Orders fetched successfully"
            });
        } catch (error: any) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async getOrderById(req: Request, res: Response) {
        try {
            const userId = req.user?._id?.toString();
            const { orderId } = req.params;
            const order = await orderService.getOrderById(userId!, orderId);

            return res.status(200).json({
                success: true,
                data: order,
                message: "Order fetched successfully"
            });
        } catch (error: any) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async clearOrder(req: Request, res: Response){
        try {
            const userId = req.user?._id?.toString();
            const {orderId} = req.params; 

            await orderService.clearOrder(userId!, orderId);

            return res.status(200).json({
                success: true,
                message: "Order cancelled successfully"
            });
        }catch (error: any){
            return res.status(error.statusCode || 500).json({
                success: false, 
                message: error.message || "Internal Server Error"
            });
        }
    }
}
