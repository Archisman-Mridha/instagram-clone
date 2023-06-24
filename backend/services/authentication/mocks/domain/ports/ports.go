// Code generated by MockGen. DO NOT EDIT.
// Source: ./domain/ports/ports.go

// Package mock_ports is a generated GoMock package.
package mock_ports

import (
	reflect "reflect"

	ports "github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/ports"
	gomock "github.com/golang/mock/gomock"
)

// MockPrimaryDB is a mock of PrimaryDB interface.
type MockPrimaryDB struct {
	ctrl     *gomock.Controller
	recorder *MockPrimaryDBMockRecorder
}

// MockPrimaryDBMockRecorder is the mock recorder for MockPrimaryDB.
type MockPrimaryDBMockRecorder struct {
	mock *MockPrimaryDB
}

// NewMockPrimaryDB creates a new mock instance.
func NewMockPrimaryDB(ctrl *gomock.Controller) *MockPrimaryDB {
	mock := &MockPrimaryDB{ctrl: ctrl}
	mock.recorder = &MockPrimaryDBMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockPrimaryDB) EXPECT() *MockPrimaryDBMockRecorder {
	return m.recorder
}

// IsEmailPreRegisteredByVerifiedUser mocks base method.
func (m *MockPrimaryDB) IsEmailPreRegisteredByVerifiedUser(email string) (bool, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "IsEmailPreRegisteredByVerifiedUser", email)
	ret0, _ := ret[0].(bool)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// IsEmailPreRegisteredByVerifiedUser indicates an expected call of IsEmailPreRegisteredByVerifiedUser.
func (mr *MockPrimaryDBMockRecorder) IsEmailPreRegisteredByVerifiedUser(email interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "IsEmailPreRegisteredByVerifiedUser", reflect.TypeOf((*MockPrimaryDB)(nil).IsEmailPreRegisteredByVerifiedUser), email)
}

// SaveNewUser mocks base method.
func (m *MockPrimaryDB) SaveNewUser(details *ports.UserDetails) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "SaveNewUser", details)
	ret0, _ := ret[0].(error)
	return ret0
}

// SaveNewUser indicates an expected call of SaveNewUser.
func (mr *MockPrimaryDBMockRecorder) SaveNewUser(details interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "SaveNewUser", reflect.TypeOf((*MockPrimaryDB)(nil).SaveNewUser), details)
}

// MockCache is a mock of Cache interface.
type MockCache struct {
	ctrl     *gomock.Controller
	recorder *MockCacheMockRecorder
}

// MockCacheMockRecorder is the mock recorder for MockCache.
type MockCacheMockRecorder struct {
	mock *MockCache
}

// NewMockCache creates a new mock instance.
func NewMockCache(ctrl *gomock.Controller) *MockCache {
	mock := &MockCache{ctrl: ctrl}
	mock.recorder = &MockCacheMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockCache) EXPECT() *MockCacheMockRecorder {
	return m.recorder
}
