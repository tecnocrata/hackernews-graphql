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
              <Link key={link.id} updateStoreAfterVote={this._updateCacheAfterVote} index={index} link={link}/>
            ))}
          </div>
        )
      }

      componentDidMount() {
        //this invication subscribes to events
        this._subscribeToNewLinks()
        this._subscribeToNewVotes()
      }
    
      _updateCacheAfterVote = (store, createVote, linkId) => {
        // 1
        const data = store.readQuery({ query: FEED_QUERY })
      
        // 2
        const votedLink = data.feed.links.find(link => link.id === linkId)
        votedLink.votes = createVote.link.votes
      
        // 3
        store.writeQuery({ query: FEED_QUERY, data })
      }

      _subscribeToNewLinks = () => {
        this.props.feedQueryx.subscribeToMore({
          document: gql`
            subscription {
              newLink {
                node {
                  id
                  url
                  description
                  createdAt
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
          `,
          updateQuery: (previous, { subscriptionData }) => {
            //this function allows you to determine how the store should be updated with the information 
            //that was sent by the server after the event occurred.
            const newAllLinks = [subscriptionData.data.newLink.node, ...previous.feed.links]
            const result = {
              ...previous,
              feed: {
                links: newAllLinks
              },
            }
            return result
          }
        })
      }

      _subscribeToNewVotes = () => {
        this.props.feedQueryx.subscribeToMore({
          document: gql`
            subscription {
              newVote {
                node {
                  id
                  link {
                    id
                    url
                    description
                    createdAt
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
                  user {
                    id
                  }
                }
              }
            }
          `,
        })
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