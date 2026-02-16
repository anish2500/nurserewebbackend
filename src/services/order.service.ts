import { OrderModel } from "../models/order.model";
import { HttpError } from "../errors/http-error";

export class OrderService {
    async createOrder(userId: string, items: any[], totalAmount: number) {
        const order = await OrderModel.create({
            userId,
            items,
            totalAmount
        });
        return order;
    }

    async getOrdersByUser(userId: string) {
        const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 })
        .populate('items.plantId', 'name price plantImage');
        return orders;
    }

    async getOrderById(userId: string, orderId: string) {
        const order = await OrderModel.findOne({ _id: orderId, userId })
        .populate('items.plantId', 'name price plantImage');
        if (!order) {
            throw new HttpError(404, "Order not found");
        }
        return order;
    }

    async clearOrder(userId: string, orderId: string){
        const order = await OrderModel.findOneAndDelete({_id: orderId, userId});
        if(!order){
            throw new HttpError(404, "Order not found");
        }
        return order; 
    }

    async getAllOrders(){
        const orders = await OrderModel.find()
        .sort({ createdAt: -1})
        .populate('items.plantId', 'name price plantImage')
        .populate('userId', 'fullName email username');

        return orders; 
    }

    async getOrderByIdAdmin(orderId: string){
        const order = await OrderModel.findById(orderId)
            .populate('items.plantId', 'name price plantImage')
            .populate('userId', 'fullName email username');

        if (!order){
            throw new HttpError(404, "Order not found");
        }    
        return order; 
    }

}
