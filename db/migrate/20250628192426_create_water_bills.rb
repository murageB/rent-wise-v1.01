class CreateWaterBills < ActiveRecord::Migration[7.1]
  def change
    create_table :water_bills do |t|
      t.references :unit, null: false, foreign_key: true
      t.references :tenant, null: false, foreign_key: true
      t.date :billing_period
      t.decimal :current_reading
      t.decimal :previous_reading
      t.decimal :usage_amount
      t.decimal :rate_per_unit
      t.decimal :total_amount
      t.date :due_date
      t.boolean :paid
      t.date :paid_date

      t.timestamps
    end
  end
end
