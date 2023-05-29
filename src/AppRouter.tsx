import React from "react";
import { Route, Switch } from "wouter";
import HomeView from "./views/HomeView";
import ActualMainView from "./views/ActualMainView";

interface AppRouterProps {}

export default function AppRouter(props: AppRouterProps) {
  return (
    <>
      <Switch>
        <Route path="/" component={HomeView} />

        <Route path="/:edition" component={ActualMainView} />
        <Route
          path="/:edition/d/:tableHash/:treeHash?/:lineHash?"
          component={ActualMainView}
        />

        <Route>404, Not Found!</Route>
      </Switch>
    </>
  );
}
