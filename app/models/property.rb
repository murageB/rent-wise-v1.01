class Property < ApplicationRecord
  has_many :units, dependent: :destroy
  has_many :maintenance_requests, dependent: :destroy
  has_many :tenants, through: :units
  has_many :rent_payments, through: :units
  
  validates :name, presence: true
  validates :address, presence: true
  validates :property_type, presence: true
end
