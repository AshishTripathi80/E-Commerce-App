package com.backend.service.auth;

import com.backend.dto.SignupRequest;
import com.backend.dto.UserDTO;

public interface AuthService {

    UserDTO createUser(SignupRequest signupRequest);

    boolean hasUserWithEmail(String email);
}

