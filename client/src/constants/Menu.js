import React from "react";
import { Menu } from "antd";
import Search from "../components/Search";
import Catalogue from "../components/Catalogue";

const { Item } = Menu ;

export const MenuItems = [
	<Item key="search" renderer={ Search }>Search</Item> ,
  <Item key="catalogue" renderer={ Catalogue }>Catalogue</Item> ,
] ;