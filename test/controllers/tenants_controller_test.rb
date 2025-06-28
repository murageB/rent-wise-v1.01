require "test_helper"

class TenantsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @tenant = tenants(:one)
    @user = users(:one)
    sign_in @user
  end

  test "should get index" do
    get tenants_url
    assert_response :success
  end

  test "should get new" do
    get new_tenant_url
    assert_response :success
  end

  test "should create tenant" do
    assert_difference('Tenant.count') do
      post tenants_url, params: { tenant: { user_id: users(:two).id, unit_id: units(:two).id, lease_start_date: Date.current, lease_end_date: Date.current + 1.year, rent_amount: 1000, status: "active" } }
    end
    assert_redirected_to tenant_url(Tenant.last)
  end

  test "should show tenant" do
    get tenant_url(@tenant)
    assert_response :success
  end

  test "should get edit" do
    get edit_tenant_url(@tenant)
    assert_response :success
  end

  test "should update tenant" do
    patch tenant_url(@tenant), params: { tenant: { status: "inactive" } }
    assert_redirected_to tenant_url(@tenant)
  end

  test "should destroy tenant" do
    assert_difference('Tenant.count', -1) do
      delete tenant_url(@tenant)
    end
    assert_redirected_to tenants_url
  end

  test "should require authentication" do
    sign_out @user
    get tenants_url
    assert_redirected_to new_user_session_url
  end
end
