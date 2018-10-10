import gql from 'graphql-tag';

/*export const onDemandAdded = gql`
    subscription onDemandAdded($input: DemandInput!){
      demandAdded($input: $DemandInput){
        name
        qty
        unit
      }
    }
`;*/

export const onDemandAdded = gql`
    subscription onDemandAdded{
      demandAdded{
      	id
        name
        qty
        unit
        verified
        closed
        createdAt
        modifiedAt
        user{
        	name
        	email
        	phone
        }
      }
    }
`;
export const onSupplyAdded = gql`
    subscription onSupplyAdded{
      supplyAdded{
      	id
        name
        qty
        unit
        verified
        createdAt
        modifiedAt
        user{
        	name
        	email
        	phone
        }
      }
    }
`;
export const onActivityAdded = gql`
    subscription onActivityAdded{
      activityAdded{
      	id
        name
        description
        date
        verified
        createdAt
        modifiedAt
        user{
        	name
        	email
        	phone
        }
      }
    }
`;
export const onDemographyAdded = gql`
    subscription onDemographyAdded{
      demographyAdded{
      	id
        male
		female
		children
		adult
		lansia
		difable	      
        verified
        createdAt
        modifiedAt
        user{
        	name
        	email
        	phone
        }
      }
    }
`;
