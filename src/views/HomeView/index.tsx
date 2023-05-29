import React from "react";
import { AppLink } from "../../components/Button";

interface HomeViewProps {}

export default function HomeView(props: HomeViewProps) {
  return (
    <ul>
      <li>
        <AppLink to="/edition-one">Edition One</AppLink>
      </li>
      <li>
        <AppLink to="/edition-two">Edition Two</AppLink>
      </li>
    </ul>
  );
}
