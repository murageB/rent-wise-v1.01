Rails.application.routes.draw do
  get '/dashboard', to: 'dashboard#index', as: :dashboard
  get 'dashboard/index'
  get 'rent_payments/index'
  get 'rent_payments/show'
  get 'rent_payments/new'
  get 'rent_payments/edit'
  get 'maintenance_requests/index'
  get 'maintenance_requests/show'
  get 'maintenance_requests/new'
  get 'maintenance_requests/edit'
  get 'tenants/index'
  get 'tenants/show'
  get 'tenants/new'
  get 'tenants/edit'
  get 'units/index'
  get 'units/show'
  get 'units/new'
  get 'units/edit'
  devise_for :users
  resources :properties
  
  # Blockchain routes
  get 'blockchain/status', to: 'blockchain#status'
  get 'blockchain/property_data/:property_id', to: 'blockchain#property_data'
  post 'blockchain/property_data/:property_id', to: 'blockchain#property_data'
  get 'blockchain/verify_integrity/:property_id', to: 'blockchain#verify_integrity'
  get 'blockchain/latest_blocks', to: 'blockchain#latest_blocks'
  
  get 'home/index'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  root "home#index"
end
