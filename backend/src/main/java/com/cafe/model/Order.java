package com.cafe.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String status = "pending";
    private Integer queueNumber;
    
    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime timestamp;
    
    @Column(precision = 10, scale = 2)
    private Double totalAmount;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_id")
    private List<OrderItem> items;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}