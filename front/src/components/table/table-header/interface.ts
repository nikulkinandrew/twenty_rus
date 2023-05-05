import { DocumentNode } from 'graphql';
import { ReactNode } from 'react';
import {
  Companies_Bool_Exp,
  Order_By,
  People_Bool_Exp,
  Users_Bool_Exp,
} from '../../../generated/graphql';
import { GraphqlQueryCompany } from '../../../interfaces/company.interface';
import {
  SEARCH_COMPANY_QUERY,
  SEARCH_PEOPLE_QUERY,
} from '../../../services/search/search';
import { GraphqlQueryPerson } from '../../../interfaces/person.interface';

export type SortType<OrderByTemplate> =
  | {
      _type: 'default_sort';
      label: string;
      key: keyof OrderByTemplate & string;
      icon?: ReactNode;
    }
  | {
      _type: 'custom_sort';
      label: string;
      key: string;
      icon?: ReactNode;
      orderByTemplate: (order: Order_By) => OrderByTemplate;
    };

export const defaultOrderByTemplateFactory =
  (key: string) => (order: string) => ({
    [key]: order,
  });

export type SelectedSortType<OrderByTemplate> = SortType<OrderByTemplate> & {
  order: 'asc' | 'desc';
};

export type FilterType<WhereTemplate, FilterValue = Record<string, any>> = {
  operands: FilterOperandType[];
  label: string;
  key: string;
  icon: ReactNode;
  whereTemplate: (
    operand: FilterOperandType,
    value: FilterValue,
  ) => WhereTemplate | undefined;
  searchQuery: DocumentNode;
  searchTemplate: (
    searchInput: string,
  ) => People_Bool_Exp | Companies_Bool_Exp | Users_Bool_Exp;
  searchResultMapper: (data: any) => {
    displayValue: string;
    value: FilterValue;
  };
};

export type FilterOperandType = {
  label: string;
  id: string;
  keyWord: 'ilike' | 'not_ilike' | 'equal' | 'not_equal';
};

export type SelectedFilterType<WhereTemplate> = FilterType<WhereTemplate> & {
  value: string;
  operand: FilterOperandType;
  where: WhereTemplate;
};

export function assertFilterUseCompanySearch<FilterValue>(
  filter: FilterType<People_Bool_Exp>,
): filter is FilterType<People_Bool_Exp> & {
  searchResultMapper: (data: GraphqlQueryCompany) => {
    displayValue: string;
    value: FilterValue;
  };
} {
  return filter.searchQuery === SEARCH_COMPANY_QUERY;
}

export function assertFilterUsePeopleSearch<FilterValue>(
  filter: FilterType<People_Bool_Exp>,
): filter is FilterType<People_Bool_Exp> & {
  searchResultMapper: (data: GraphqlQueryPerson) => {
    displayValue: string;
    value: FilterValue;
  };
} {
  return filter.searchQuery === SEARCH_PEOPLE_QUERY;
}
