import * as NetworkInfo from 'react-native-network-info';
import * as superagent from 'superagent';
import * as Rx from 'rxjs';

export const SERVICE_PORT = 6324;
export const SERVICE_PATH = '/estream/scan';

class Network {
    _getIPAddress() {
        return new Promise(resolve => {
            NetworkInfo.getIPAddress(resolve);
        });
    }

    heartbeat(url) {
        return new Promise((resolve, reject) => {
            superagent.get(url).timeout(500).end((err, res) => {
                let resText = res ? res.text : null;

                if (err || resText !== 'estream-ready') return reject();
                resolve();
            });
        });
    }

    discover() {
        return new Promise((resolve, reject) => {
            this._getIPAddress().then(deviceIp => {
                let splitIp = deviceIp.split('.');
                splitIp.pop();
                let baseIp = splitIp.join('.') + '.';
                
                let discovered;
                let oct4 = 1;
 
                let discover = Rx.Observable.create(subscriber => {
                    let targetIp = baseIp + oct4;
                    let url = 'http://' + targetIp + ':' + SERVICE_PORT + '/estream/discover';
                    this.heartbeat(url).then(
                        () => { subscriber.next(targetIp); subscriber.complete(); },
                        () => {
                            oct4++;
                            if (oct4 < 30) subscriber.error();
                            else {
                                subscriber.next(null);
                                subscriber.complete();
                            }
                        }
                    );
                }).retry().last();

                discover.subscribe(discover => resolve(discover));
            });
        });
    }

    watchStream(host, streamName, quality, cb) {
        if ( ! host ) return cb(new Error('You must discover your host device before you can make requests.'));
        let url = 'http://' + host + ':' + SERVICE_PORT + '/estream/stream/watch?name=' + streamName + '&quality=' + quality;
        superagent.get(url).timeout(10000).end((err, res) => {
            if (err) return cb(new Error('Host device unreachable. Ensure your host device is configured properly.'));
            if (res.text === 'ok') return cb();

            // Not ok
            if (res.text === 'not-found') alert('The stream you requested is no longer live.');
            if (res.text === 'error') alert('An unknown error has occured on the host device.');
            return cb();
        });
    }
}

const network = new Network();
export { network as Network };
