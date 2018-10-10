import gql from 'graphql-tag';

export const getUser = gql`
	query getUser($email: String!){
		getUser(email: $email){			
			id
			name
			email
			phone
			profile{
				gender
				nickname
				picture
				sub
			}
			verified			
			createdAt			
			modifiedAt			
		}
	}
`;

export const point = gql`
	query point($id: ID!){
		point(id:$id){
			id
			name
		    description
		    contact
		    address
		    latitude
		    longitude		    
		    demographies{
		      male
		      female
		      createdAt
		      user{
		      	name
		      	email
		      	phone
		      }
		    }

		}
	}
`;

export const listPoints = gql`
	query points($limit: Int, $skip: Int){
		points(limit:$limit, skip:$skip){
			id
			name
			address
			category
		}
	}
`;

export const pointDemands = gql`
	query demands($pointId:ID!){
		demands(pointId:$pointId){
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
export const pointSupplies = gql`
	query supplies($pointId:ID!){
		supplies(pointId:$pointId){
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
export const pointActivities = gql`
	query activities($pointId:ID!){
		activities(pointId:$pointId){
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