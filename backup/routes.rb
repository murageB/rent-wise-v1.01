Rails.application.routes.draw do
  root 'home#index'
  resources :properties
  # Other routes...
end