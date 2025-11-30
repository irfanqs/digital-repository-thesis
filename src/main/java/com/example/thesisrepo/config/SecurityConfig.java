package com.example.thesisrepo.config;

import com.example.thesisrepo.service.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

  private final UserDetailsServiceImpl userDetailsService;

  public SecurityConfig(UserDetailsServiceImpl userDetailsService) {
    this.userDetailsService = userDetailsService;
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public DaoAuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setUserDetailsService(userDetailsService);
    provider.setPasswordEncoder(passwordEncoder());
    return provider;
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
    return authConfig.getAuthenticationManager();
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      // we disable CSRF here because the frontend talks to the API with fetch()
      .csrf(csrf -> csrf.disable())
      .authenticationProvider(authenticationProvider())
      .authorizeHttpRequests(auth -> auth
        // public pages (no login needed)
        .requestMatchers(
          "/",                // maps to static index.html
          "/index.html",
          "/login",           // allow React login page
          "/favicon.ico",
          "/assets/**",       // Vite / static assets
          "/css/**",
          "/js/**",
          "/images/**",
          "/webjars/**",
          "/error"
        ).permitAll()

        // public registration endpoints
        .requestMatchers(
          "/api/auth/register",
          "/api/auth/logout"
        ).permitAll()

        // public search endpoints (digital repository)
        .requestMatchers("/api/public/**").permitAll()

        // student-facing lecturer endpoints
        .requestMatchers("/api/lecturers/list", "/api/lecturers/supervisees").hasAnyRole("STUDENT", "ADMIN")

        // role-protected API areas
        .requestMatchers("/api/admin/**").hasRole("ADMIN")
        .requestMatchers("/api/lecturers/**").hasRole("LECTURER")
        .requestMatchers("/api/theses/**").hasRole("STUDENT")

        // everything else must be authenticated
        .anyRequest().authenticated()
      )
      // allow both HTTP Basic (for tools) and form login (for browser)
      .httpBasic(Customizer.withDefaults())
      .formLogin(form -> form
        .loginPage("/login")  // use the default /login page
        .permitAll()
      )
      .logout(logout -> logout
        .logoutUrl("/logout")
        .logoutSuccessUrl("/login")
        .invalidateHttpSession(true)
        .deleteCookies("JSESSIONID")
        .permitAll()
      );

    return http.build();
  }
}
