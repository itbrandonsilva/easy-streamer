import * as NetworkInfo from 'react-native-network-info';
import * as async from 'async';
import * as superagent from 'superagent';

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
            superagent.get(url).timeout(250).end((err, res) => {
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
 
                async.doUntil(
                    (cb) => {
                        let targetIp = baseIp + oct4;
                        let url = 'http://' + targetIp + ':' + SERVICE_PORT + '/estream/discover';
                        this.heartbeat(url).then(
                            () => { discovered = targetIp; cb(); },
                            () => { oct4++; cb(); }
                        );
                    },
                    () => discovered || oct4 > 30,
                    err => {
                        if (err) throw err;
                        //resolve('192.168.1.19');
                        resolve(discovered);
                    }
                );
                
            });
        });

           /*let scanResults$ = Rx.Observable.while(
                () => !discovered || oct4 >= 255,
                Rx.Observable.create(observer => {
                    let targetIp = baseIp + oct4;
                    fetch('http://' +  + ':' + service_port + '/').then(
                        () => { discovered = targetip; observer.complete(); },
                        () => { ++oct4; observer.complete(); }
                    );
                })
            );

            scanResults$.subscribe({
                complete: () => {
                    alert(oct4 + ' ' + discovered);
                },
            });*/
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
