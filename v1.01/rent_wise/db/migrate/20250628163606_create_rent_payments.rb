class CreateRentPayments < ActiveRecord::Migration[7.1]
  def change
    create_table :rent_payments do |t|
      t.references :tenant, null: false, foreign_key: true
      t.references :unit, null: false, foreign_key: true
      t.decimal :amount
      t.date :payment_date
      t.string :payment_method
      t.string :status
      t.string :reference_number

      t.timestamps
    end
  end
end
