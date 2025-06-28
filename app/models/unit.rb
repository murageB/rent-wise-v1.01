class Unit < ApplicationRecord
  belongs_to :property
  has_many :tenants, dependent: :destroy
  has_many :maintenance_requests, dependent: :destroy
  has_many :rent_payments, dependent: :destroy
  
  validates :unit_number, presence: true, uniqueness: { scope: :property_id }
  validates :property_id, presence: true
end 