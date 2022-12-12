
class Associator {
    constructor(authKey, attributes, debug) {
        if (authKey == '' || authKey == null || typeof authKey == 'undefined') {
            console.log('Error: authKey not provided')
            return
        }
        this.attributes = attributes;
        this.splitSettings = {
            core: {
                authorizationKey: authKey,
                // key represents your internal user id, or the account id that 
                // the user belongs to. 
                // This could also be a cookie you generate for anonymous users
                key: 'key'
            },
            debug: !!debug
        }
        this.keys = [];
        this.clients = [];
        this.trafficTypeToKeyMap = {};
        this.splitToTrafficTypeMap = {};
        this.factory = splitio(this.splitSettings);
        this.initDefaultClient();
        this.initTrafficTypeMap();
    }

    setAttribute(key, value) {
        this.attributes[key] = value;
    }

    getAttribute(key) {
        return this.attributes[key];
    }

    clearAllAttributes() {
        this.attributes = {}
    }

    async initDefaultClient() {
        console.log('setting default client');
        this.defaultClient = this.factory.client() ;
        await this.defaultClient.ready()
        return
    }

    async initTrafficTypeMap() {
        self = this;
       let manager = this.factory.manager();
       await manager.ready()
       let splits = manager.splits();
       splits.forEach(function(v, i, a) {
            self.splitToTrafficTypeMap[v.name] = v.trafficType;
       })
    }

    async getReady(key, trafficType) {
        if (key == '' || typeof key == 'undefined') { 
            console.error('Error: key not defined');
        } else if(this.keys.indexOf(key) !== -1) {
            // key already tracked
            return
        } else {
            let newClient = this.factory.client(key) ;
            await newClient.ready();
            this.keys.push(key);
            this.trafficTypeToKeyMap[trafficType] = key;
            this.clients.push(newClient);
            return            
        }
    }

    getTreatment(splitName, config) {
        let client;
        let trafficType = this.splitToTrafficTypeMap[splitName]
        let element = Object.keys(this.trafficTypeToKeyMap).indexOf(trafficType);
        let key = Object.values(this.trafficTypeToKeyMap)[element]
        if (typeof trafficType == 'undefined') {
            console.error('Split does not exist: '+splitName)
            return
       }   else if (element == -1) {
            console.error('Client does not exist for trafficType: '+trafficType)
            return
        } else {
            client = this.clients[element]
        }
        
        if(typeof config != 'undefined' && !!config) {
            return {key: key, result: client.getTreatmentWithConfig(splitName, this.attributes)}
        } else {
            return {key: key, result: client.getTreatment(splitName, this.attributes)}
        }
    } 

    track(eventType, value, properties) {
        self = this;
        let trackedEvents = {}
        this.clients.forEach(
            function(client, index, array) {
                let key = Object.keys(self.trafficTypeToKeyMap)[index]
                let success = client.track(key, eventType, parseFloat(value), properties)
                if(!success) {
                    console.error(eventType+' event not tracked for key: '+key)
                } else {
                    trackedEvents[key] = {eventType:eventType, value:value}
                }
            }
        )
        return trackedEvents;
    }
    destroyAll() {
        this.clients.forEach(
            async function(client, index, array) {
                await client.destroy();
                console.log('Client Destroyed!')
            }
        )
        console.log('all clients destroyed')
    }   
    destroyClient(key) {
        let element = this.keys.indexOf(key);
        console.log('destroying client for key: '+key)
        return this.clients[element].destroy()

    }  
}




