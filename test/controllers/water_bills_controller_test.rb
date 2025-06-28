require "test_helper"

class WaterBillsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  setup do
    @user = users(:one)
    @tenant = tenants(:one)
    sign_in @user
  end

  test "should get index" do
    get water_bills_url
    assert_response :success
  end

  test "should get show" do
    get water_bill_url(water_bills(:one))
    assert_response :success
  end

  test "should get new" do
    get new_water_bill_url
    assert_response :success
  end

  test "should get create" do
    assert_difference('WaterBill.count', 1) do
      post water_bills_url, params: { water_bill: { unit_id: units(:one).id, tenant_id: tenants(:one).id, billing_period: Date.current, current_reading: 100, previous_reading: 90, rate_per_unit: 2.5, due_date: Date.current + 30.days } }
    end
    assert_redirected_to water_bill_url(WaterBill.last)
  end

  test "should get edit" do
    get edit_water_bill_url(water_bills(:one))
    assert_response :success
  end

  test "should get update" do
    patch water_bill_url(water_bills(:one)), params: { water_bill: { current_reading: 110 } }
    assert_redirected_to water_bill_url(water_bills(:one))
  end

  test "should get destroy" do
    assert_difference('WaterBill.count', -1) do
      delete water_bill_url(water_bills(:one))
    end
    assert_redirected_to water_bills_url
  end
end
