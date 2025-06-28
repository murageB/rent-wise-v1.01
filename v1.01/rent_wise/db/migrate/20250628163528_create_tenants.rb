class CreateTenants < ActiveRecord::Migration[7.1]
  def change
    create_table :tenants do |t|
      t.references :user, null: false, foreign_key: true
      t.references :unit, null: false, foreign_key: true
      t.date :lease_start_date
      t.date :lease_end_date
      t.decimal :rent_amount
      t.string :status

      t.timestamps
    end
  end
end
