import { Stack } from './stack';


// tslint:disable
describe('stackTest<T>', () => {
    let stack: Stack<string>;

    beforeEach(() => {
        stack = new Stack<string>();
    });
    it('should create', () => {
        expect(stack).toBeTruthy();
    });

    it('isEmpty should return true if the stackTest is empty ', () => {
        expect(stack.isEmpty()).toBeTrue();
    });

    it('add() should add element to the stackTest', () => {
        const spy = spyOn<any>(stack['array'], 'push');
        stack.add('something');
        expect(spy).toHaveBeenCalled();
    });

    it('delete should delete an  element from  the stackTest if the element is in the stackTest', () => {
        const spy = spyOn<any>(stack['array'], 'splice');
        const object= 'something';
        stack.add(object);
        stack.add('Log2990');
        stack.delete(object);
        expect(spy).toHaveBeenCalled();
    });

    it('delete should do nothing if the element is not in the stackTest', () => {
        const spy = spyOn<any>(stack['array'], 'splice');
        const object= 'something';
        stack.delete(object);
        expect(spy).not.toHaveBeenCalled();
    });

    it('pop should pop of the array', () => {
        const spy = spyOn<any>(stack['array'], 'pop');
        stack.pop();
        expect(spy).toHaveBeenCalled();
    });

    it('#getAll should return all elements in the stackTest', () => {
        const array = ['Log', '29', '90'];
        for (const st of array) {
            stack.add(st);
        }
        const result = stack.getAll();
        expect(result).toEqual(array);
    });
});
