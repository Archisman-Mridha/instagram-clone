package utils

type CtxKey struct {
	Name string
}

var USER_ID_CONTEXT_KEY = &CtxKey{"USER_ID"}
