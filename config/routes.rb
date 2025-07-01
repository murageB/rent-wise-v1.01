Rails.application.routes.draw do
  namespace :admin do
    get 'articles/index'
    get 'articles/new'
    get 'articles/create'
    get 'articles/edit'
    get 'articles/update'
    get 'articles/destroy'
    resources :articles do
      member do
        get :preview
        patch :publish
        patch :unpublish
      end
      collection do
        post :ai_generate
        post :ai_optimize
        post :ai_suggest_keywords
        post :ai_generate_meta_description
      end
    end
  end
  get 'blog/index'
  get 'blog/show'
  devise_for :users, controllers: { sessions: 'users/sessions' }
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "home#index"
  
  authenticated :user do
    root "dashboard#index", as: :authenticated_root
  end
  
  # Dashboard route
  get 'dashboard', to: 'dashboard#index'
  
  # Analytics routes
  get 'analytics', to: 'analytics#dashboard'
  get 'analytics/financial', to: 'analytics#financial'
  get 'analytics/occupancy', to: 'analytics#occupancy'
  get 'analytics/maintenance', to: 'analytics#maintenance'
  get 'analytics/property/:id', to: 'analytics#property_analytics', as: :property_analytics
  get 'analytics/export/:report_type', to: 'analytics#export', as: :export_analytics
  get 'analytics/real-time', to: 'analytics#real_time'
  
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
  
  # Blog routes
  get 'blog', to: 'blog#index'
  get 'blog/:id', to: 'blog#show', as: :blog_article

  # Admin login route
  post 'admin_login', to: 'admin/sessions#create', as: :admin_login
end 