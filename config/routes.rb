Rails.application.routes.draw do
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "dashboard#index"
  
  # Dashboard route
  get 'dashboard', to: 'dashboard#index'
  
  # Resource routes with nested resources
  resources :properties do
    resources :units
    resources :maintenance_requests
    resources :tenants
  end
  
  # Standalone resource routes (for direct access)
  resources :units
  resources :tenants
  resources :maintenance_requests
  
  resources :rent_payments
  resources :water_bills do
    member do
      patch :mark_as_paid
    end
  end
  
  # Home route (keeping for backward compatibility)
  get 'home', to: 'home#index'
  
  # Blockchain routes
  get 'blockchain/status', to: 'blockchain#status'
  get 'blockchain/property_data/:property_id', to: 'blockchain#property_data'
  post 'blockchain/property_data/:property_id', to: 'blockchain#property_data'
  get 'blockchain/verify_integrity/:property_id', to: 'blockchain#verify_integrity'
  get 'blockchain/latest_blocks', to: 'blockchain#latest_blocks'
  
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
end 