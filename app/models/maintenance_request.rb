class MaintenanceRequest < ApplicationRecord
  belongs_to :property
  belongs_to :unit, optional: true
  belongs_to :tenant, optional: true
end 