class CreateMaintenanceRequests < ActiveRecord::Migration[7.1]
  def change
    create_table :maintenance_requests do |t|
      t.references :property, null: false, foreign_key: true
      t.references :unit, null: false, foreign_key: true
      t.references :tenant, null: false, foreign_key: true
      t.string :title
      t.text :description
      t.string :priority
      t.string :status
      t.datetime :requested_date
      t.datetime :completed_date

      t.timestamps
    end
  end
end
