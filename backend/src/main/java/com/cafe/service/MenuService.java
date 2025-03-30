package com.cafe.service;

import com.cafe.model.MenuItem;
import com.cafe.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuService {
    
    @Autowired
    private MenuItemRepository menuItemRepository;
    
    @Cacheable("menuItems")
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }
}