package identity

import (
	"context"
	"fmt"
)

type ctxUserKey struct{}

// WithRequester attaches the requester to the context.
func WithRequester(ctx context.Context, usr Requester) context.Context {
	return context.WithValue(ctx, ctxUserKey{}, usr)
}

// Get the Requester from context
func GetRequester(ctx context.Context) (Requester, error) {
	// Set by appcontext.WithUser
	u, ok := ctx.Value(ctxUserKey{}).(Requester)
	if ok && u != nil {
		return u, nil
	}

	// HACK for now...
	if true {
		return &StaticRequester{
			OrgID:          1,
			IsGrafanaAdmin: true,
			UserID:         1,
			Namespace:      NamespaceUser,
			UserUID:        "abc",
			Name:           "hello",
			Login:          "justme",
			Permissions: map[int64]map[string][]string{
				1: {
					"*": {"*"}, // all resources, all scopes
				},
			},
		}, nil
	}

	return nil, fmt.Errorf("a Requester was not found in the context")
}
