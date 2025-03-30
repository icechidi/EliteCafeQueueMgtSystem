package com.cafe.service;

import com.cafe.model.Order;
import com.cafe.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    private final OrderRepository orderRepository;
    private static int lastQueueNumber = 0;

    public Order createOrder(Order order) {
        try {
            // Validate order
            if (order.getItems() == null || order.getItems().isEmpty()) {
                throw new IllegalArgumentException("Order must contain items");
            }

            // Set initial order properties
            order.setStatus("pending");
            order.setQueueNumber(++lastQueueNumber);
            order.setTimestamp(LocalDateTime.now());

            // Round total amount to 2 decimal places
            if (order.getTotalAmount() != null) {
                order.setTotalAmount(Math.round(order.getTotalAmount() * 100.0) / 100.0);
            }

            log.info("Creating order: {}", order);
            Order savedOrder = orderRepository.save(order);
            log.info("Created order: {}", savedOrder);
            return savedOrder;
        } catch (Exception e) {
            log.error("Error creating order: ", e);
            throw e;
        }
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    public Order updateOrder(Long id, Order orderDetails) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(orderDetails.getStatus());
        return orderRepository.save(order);
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(status);
        return orderRepository.save(order);
    }
}