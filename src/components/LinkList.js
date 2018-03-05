import React, { Component } from 'react'
import Link from './Link'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class LinkList extends Component {
    render() {
        // 1
        if (this.props.feedQueryx && this.props.feedQueryx.loading) {
          return <div>Loading</div>
        }
      
        // 2
        if (this.props.feedQueryx && this.props.feedQueryx.error) {
          return <div>Error</div>
        }
      
        // 3
        const linksToRender = this.props.feedQueryx.feed.links
      
        return (
          <div>
            {linksToRender.map((link, index) => (
              <Link key={link.id} index={index} link={link} />
            ))}
          </div>
        )
      }
}

// 1
export const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`

// 3
export default graphql(FEED_QUERY, { name: 'feedQueryx' }) (LinkList)