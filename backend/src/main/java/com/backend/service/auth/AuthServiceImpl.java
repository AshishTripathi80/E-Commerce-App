package com.backend.service.auth;


import com.backend.dto.SignupRequest;
import com.backend.dto.UserDTO;
import com.backend.entity.Order;
import com.backend.entity.User;
import com.backend.enums.OrderStatus;
import com.backend.enums.UserRole;
import com.backend.repository.OrderRepository;
import com.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    //@Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserDTO createUser(SignupRequest signupRequest){
        User user=new User();
        user.setEmail(signupRequest.getEmail());
        user.setName(signupRequest.getName());
        user.setPassword(new BCryptPasswordEncoder().encode(signupRequest.getPassword()));
        user.setRole(UserRole.CUSTOMER);
        User createUser= userRepository.save(user);

        Order order=new Order();
        order.setAmount(0L);
        order.setTotalAmount(0L);
        order.setDiscount(0L);
        order.setUser(createUser);
        order.setOrderStatus(OrderStatus.Pending);
        orderRepository.save(order);

        UserDTO userDTO=new UserDTO();
        userDTO.setId(createUser.getId());

        return userDTO;
    }

    public boolean hasUserWithEmail(String email){
     return userRepository.findFirstByEmail(email).isPresent();
    }

   /* @PostConstruct
    public void createAdminAccount(){
        User adminAccount =userRepository.findByRole(UserRole.ADMIN);
        if (adminAccount==null){
            User user=new User();
            user.setEmail("admin@test.com");
            user.setName("admin");
            user.setRole(UserRole.ADMIN);
            user.setPassword(new BCryptPasswordEncoder().encode("admin"));
            userRepository.save(user);
        }
    }*/
}
