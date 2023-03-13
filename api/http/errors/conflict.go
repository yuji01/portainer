package errors

type ConflictError struct {
	msg string
}

func (e *ConflictError) Error() string {
	return e.msg
}

func NewConflictError(msg string) *ConflictError {
	return &ConflictError{msg: msg}
}
