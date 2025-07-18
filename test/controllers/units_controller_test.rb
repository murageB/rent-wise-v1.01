require "test_helper"

class UnitsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @unit = units(:one)
    @user = users(:one) # Assuming you have a user fixture
    sign_in @user
  end

  test "should get index" do
    get units_url
    assert_response :success
  end

  test "should get new" do
    get new_unit_url
    assert_response :success
  end

  test "should create unit" do
    assert_difference('Unit.count') do
      post units_url, params: { unit: { unit_number: "B102", unit_type: "2 Bedroom", rent_amount: 1800.00, property_id: @unit.property_id } }
    end

    assert_redirected_to unit_url(Unit.last)
  end

  test "should show unit" do
    get unit_url(@unit)
    assert_response :success
  end

  test "should get edit" do
    get edit_unit_url(@unit)
    assert_response :success
  end

  test "should update unit" do
    patch unit_url(@unit), params: { unit: { unit_number: "A101-Updated" } }
    assert_redirected_to unit_url(@unit)
  end

  test "should destroy unit" do
    assert_difference('Unit.count', -1) do
      delete unit_url(@unit)
    end

    assert_redirected_to units_url
  end

  test "should require authentication" do
    sign_out @user
    get units_url
    assert_redirected_to new_user_session_url
  end
end
