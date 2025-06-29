# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_06_29_174158) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "articles", force: :cascade do |t|
    t.string "title"
    t.text "content"
    t.string "author"
    t.datetime "published_at"
    t.string "medium_url"
    t.boolean "featured"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "maintenance_requests", force: :cascade do |t|
    t.bigint "property_id", null: false
    t.bigint "unit_id", null: false
    t.bigint "tenant_id", null: false
    t.string "title"
    t.text "description"
    t.string "priority"
    t.string "status"
    t.datetime "requested_date"
    t.datetime "completed_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["property_id"], name: "index_maintenance_requests_on_property_id"
    t.index ["tenant_id"], name: "index_maintenance_requests_on_tenant_id"
    t.index ["unit_id"], name: "index_maintenance_requests_on_unit_id"
  end

  create_table "properties", force: :cascade do |t|
    t.string "name"
    t.string "address"
    t.string "property_type"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "total_units"
  end

  create_table "rent_payments", force: :cascade do |t|
    t.bigint "tenant_id", null: false
    t.bigint "unit_id", null: false
    t.decimal "amount"
    t.date "payment_date"
    t.string "payment_method"
    t.string "status"
    t.string "reference_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tenant_id"], name: "index_rent_payments_on_tenant_id"
    t.index ["unit_id"], name: "index_rent_payments_on_unit_id"
  end

  create_table "tenants", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "unit_id", null: false
    t.date "lease_start_date"
    t.date "lease_end_date"
    t.decimal "rent_amount"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["unit_id"], name: "index_tenants_on_unit_id"
    t.index ["user_id"], name: "index_tenants_on_user_id"
  end

  create_table "units", force: :cascade do |t|
    t.bigint "property_id", null: false
    t.string "unit_number"
    t.string "unit_type"
    t.decimal "rent_amount"
    t.boolean "occupied"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["property_id"], name: "index_units_on_property_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "name"
    t.string "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "phone"
    t.boolean "active"
    t.datetime "last_login_at"
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "water_bills", force: :cascade do |t|
    t.bigint "unit_id", null: false
    t.bigint "tenant_id", null: false
    t.date "billing_period"
    t.decimal "current_reading"
    t.decimal "previous_reading"
    t.decimal "usage_amount"
    t.decimal "rate_per_unit"
    t.decimal "total_amount"
    t.date "due_date"
    t.boolean "paid"
    t.date "paid_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "reconnection_fee"
    t.boolean "disconnected"
    t.index ["tenant_id"], name: "index_water_bills_on_tenant_id"
    t.index ["unit_id"], name: "index_water_bills_on_unit_id"
  end

  add_foreign_key "maintenance_requests", "properties"
  add_foreign_key "maintenance_requests", "tenants"
  add_foreign_key "maintenance_requests", "units"
  add_foreign_key "rent_payments", "tenants"
  add_foreign_key "rent_payments", "units"
  add_foreign_key "tenants", "units"
  add_foreign_key "tenants", "users"
  add_foreign_key "units", "properties"
  add_foreign_key "water_bills", "tenants"
  add_foreign_key "water_bills", "units"
end
