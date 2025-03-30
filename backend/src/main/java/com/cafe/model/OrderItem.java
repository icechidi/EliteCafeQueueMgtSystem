package com.cafe.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    @Column(length = 1000)
    private String description;
    private Double price;
    private Integer quantity;
    private String category;
    private String image;
}